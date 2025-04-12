import { SearchParams, Range, Response, College } from "./types";

// Config
const API_KEY = process.env.COLLEGE_SCORECARD_API_KEY!;
const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

// Search function
export async function searchColleges(params: SearchParams): Promise<College[]> {
  try {
    console.log("Params", JSON.stringify(params));
    const query = buildQuery(params);
    console.log("Query", query.toString());

    const response = await fetch(`${BASE_URL}?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return transformResponse(await response.json());
  } catch (error) {
    console.error("Error fetching college data:", error);
    throw error;
  }
}

// Map ownership to API values
const ownershipMap: Record<
  "public" | "private non-profit" | "private for-profit",
  number
> = {
  public: 1,
  "private non-profit": 2,
  "private for-profit": 3,
};

export function getOwnershipName(ownership: number): keyof typeof ownershipMap {
  const name = Object.keys(ownershipMap).find(
    (key) => ownershipMap[key as keyof typeof ownershipMap] === ownership,
  );
  if (!name) {
    throw new Error(`Invalid ownership: ${ownership}`);
  }
  return name as keyof typeof ownershipMap;
}

export function getOwnershipValue(ownership: string): string {
  const value = ownershipMap[ownership as keyof typeof ownershipMap];
  if (!value) {
    throw new Error(`Invalid ownership: ${ownership}`);
  }
  return value.toString();
}

function buildQuery({
  school,
  student,
  admissions,
  costs,
  sort,
  paging,
}: SearchParams): URLSearchParams {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    page: paging.page.toString(),
    per_page: paging.per_page.toString(),
  });

  // Convert range parameters to API format
  const convertRangeToString = (range: Range): string => {
    if (range.min !== undefined && range.max !== undefined) {
      return `${range.min}..${range.max}`;
    }
    if (range.min !== undefined) {
      return `${range.min}..`;
    }
    if (range.max !== undefined) {
      return `..${range.max}`;
    }
    throw new Error("Invalid range");
  };

  // Process school parameters
  if (school) {
    if (school.ownership) {
      searchParams.append(
        "school.ownership",
        getOwnershipValue(school.ownership),
      );
    }

    // Process location parameters
    if (school.location) {
      if (school.location.state) {
        searchParams.append("school.state", school.location.state);
      }
      if (school.location.zip) {
        searchParams.append("school.zip", school.location.zip);
      }
      if (school.location.geographic) {
        const { latitude, longitude } = school.location.geographic;
        searchParams.append("location.lat", latitude.toString());
        searchParams.append("location.lon", longitude.toString());
      }
      if (school.location.distance) {
        searchParams.append("distance", `${school.location.distance}mi`);
      }
    }
  }

  // Process student parameters
  if (student && student.count) {
    searchParams.append(
      "latest.student.size__range",
      convertRangeToString(student.count),
    );
  }

  // Process admissions parameters
  if (admissions) {
    if (admissions.rate) {
      searchParams.append(
        "latest.admissions.admission_rate.overall__range",
        convertRangeToString(admissions.rate),
      );
    }

    if (admissions.sat_scores) {
      ["math", "reading", "writing"].forEach((section) => {
        const range = (admissions.sat_scores as any)[section];
        if (section === "reading") {
          section = "critical_reading";
        }
        if (range) {
          searchParams.append(
            `latest.admissions.sat_scores.midpoint.${section}__range`,
            convertRangeToString(range),
          );
        }
      });
    }

    if (admissions.act_scores) {
      ["cumulative", "english", "math", "writing"].forEach((section) => {
        const range = (admissions.act_scores as any)[section];
        if (range) {
          searchParams.append(
            `latest.admissions.act_scores.midpoint.${section}__range`,
            convertRangeToString(range),
          );
        }
      });
    }
  }

  // Process costs parameters
  if (costs) {
    if (costs.tuition) {
      if (costs.tuition.in_state) {
        searchParams.append(
          "latest.cost.tuition.in_state__range",
          convertRangeToString(costs.tuition.in_state),
        );
      }
      if (costs.tuition.out_of_state) {
        searchParams.append(
          "latest.cost.tuition.out_of_state__range",
          convertRangeToString(costs.tuition.out_of_state),
        );
      }
    }

    if (costs.average_net_price) {
      searchParams.append(
        "latest.cost.avg_net_price.overall__range",
        convertRangeToString(costs.average_net_price),
      );
    }

    if (costs.average_debt) {
      searchParams.append(
        "latest.aid.median_debt.completers.overall__range",
        convertRangeToString(costs.average_debt),
      );
    }
  }

  // Process control parameters
  if (sort) {
    const sortParams = sort.map((s) => `${s.field}:${s.direction}`).join(",");
    searchParams.append("sort", sortParams);
  }

  return searchParams;
}

function transformResponse(response: Response): College[] {
  return response.results.map(({ latest, location }) => ({
    name: latest.school.name,
    ownership: getOwnershipName(latest.school.ownership),
    student_count: latest.student.size,
    address: latest.school.address,
    city: latest.school.city,
    state: latest.school.state,
    zip: latest.school.zip,

    admissions: {
      rate: latest.admissions.admission_rate.overall || undefined,
      sat: {
        total:
          latest.admissions.sat_scores.midpoint.math &&
          latest.admissions.sat_scores.midpoint.critical_reading
            ? latest.admissions.sat_scores.midpoint.math +
              latest.admissions.sat_scores.midpoint.critical_reading
            : undefined,
        math: latest.admissions.sat_scores.midpoint.math || undefined,
        reading:
          latest.admissions.sat_scores.midpoint.critical_reading || undefined,
        writing: latest.admissions.sat_scores.midpoint.writing || undefined,
      },
      act: {
        total: latest.admissions.act_scores.midpoint.cumulative || undefined,
        english: latest.admissions.act_scores.midpoint.english || undefined,
        math: latest.admissions.act_scores.midpoint.math || undefined,
        writing: latest.admissions.act_scores.midpoint.writing || undefined,
      },
    },

    costs: {
      tuition: {
        in_state: latest.cost.tuition.in_state || undefined,
        out_of_state: latest.cost.tuition.out_of_state || undefined,
      },
      room: {
        on_campus: latest.cost?.room_board?.oncampus || undefined,
        off_campus: latest.cost?.room_board?.offcampus || undefined,
      },
      net: latest.cost.avg_net_price.overrall || undefined,
    },

    aid: {
      pell_grant_rate: latest.aid.pell_grant_rate || undefined,
      federal_loan_rate: latest.aid.federal_loan_rate || undefined,
      average_debt: {
        total: latest.aid.median_debt.completers.overrall || undefined,
        monthly:
          latest.aid.median_debt.completers.monthly_payments || undefined,
      },
    },

    completion: {
      rate: latest.completion.consumer_rate || undefined,
    },

    location: {
      latitude: location.lat || undefined,
      longitude: location.lon || undefined,
    },
  }));
}
