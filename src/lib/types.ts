// Common types
export interface Range {
  min?: number;
  max?: number;
}

export interface Sort {
  field: string;
  direction: "asc" | "desc";
}

// Search parameters
export interface SearchParams {
  // School
  school?: {
    ownership?: "public" | "private non-profit" | "private for-profit";
    location?: {
      state?: string;
      zip?: string;
      geographic?: {
        latitude: number;
        longitude: number;
      };
      distance?: number; // in miles
    };
  };

  // Student body
  student?: {
    count?: Range;
  };

  // Academics and admissions
  admissions?: {
    rate?: Range;
    sat_scores?: {
      math?: Range;
      reading?: Range;
      writing?: Range;
    };
    act_scores?: {
      cumulative: Range;
      math: Range;
      english: Range;
      writing: Range;
    };
  };

  // Costs and aid
  costs?: {
    tuition?: {
      in_state?: Range;
      out_of_state?: Range;
    };
    average_net_price?: Range;
    average_debt?: Range;
  };

  // Search controls
  sort?: Sort[];

  // Required pagination
  paging: {
    page: number;
    per_page: number;
  };
}

// API Response types
export interface Response {
  metadata: {
    total: number;
    page: number;
    per_page: number;
  };
  results: {
    latest: {
      school: {
        name: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        ownership: number;
        school_url: string;
      };
      student: {
        size: number;
      };
      admissions: {
        admission_rate: {
          overall: number;
        };
        sat_scores: {
          midpoint: {
            math: number;
            writing: number;
            critical_reading: number;
          };
        };
        act_scores: {
          midpoint: {
            cumulative: number;
            math: number;
            english: number;
            writing: number;
          };
        };
      };
      cost: {
        tuition: {
          in_state: number;
          out_of_state: number;
        };
        room_board: {
          oncampus: number;
          offcampus: number;
        };
        avg_net_price: {
          overrall: number;
        };
      };
      aid: {
        pell_grant_rate: number;
        federal_loan_rate: number;
        median_debt: {
          completers: {
            overrall: number;
            monthly_payments: number;
          };
        };
      };
      completion: {
        consumer_rate: number;
      };
    };
    location: {
      lat: number;
      lon: number;
    };
  }[];
}

// Extracted data
export interface College {
  name: string;
  ownership: "public" | "private non-profit" | "private for-profit";
  student_count: number;
  address: string;
  city: string;
  state: string;
  zip: string;

  admissions: {
    rate?: number;
    sat: {
      total?: number;
      math?: number;
      reading?: number;
      writing?: number;
    };
    act: {
      total?: number;
      english?: number;
      math?: number;
      writing?: number;
    };
  };

  costs: {
    tuition: {
      in_state?: number;
      out_of_state?: number;
    };
    room: {
      on_campus?: number;
      off_campus?: number;
    };
    net?: number;
  };

  aid: {
    pell_grant_rate?: number;
    federal_loan_rate?: number;
    average_debt: {
      total?: number;
      monthly?: number;
    };
  };

  completion: {
    rate?: number;
  };

  location: {
    latitude?: number;
    longitude?: number;
  };
}
