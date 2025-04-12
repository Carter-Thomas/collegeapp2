import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search as SearchIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchParams } from "@/lib/types";

interface Props {
  handleSearchProp: (searchPayload: SearchParams) => void;
}

export default function Search({ handleSearchProp }: Props) {
  const [searchData, setSearchData] = useState<SearchParams>({
    paging: { page: 1, per_page: 100 },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      handleSearchProp(searchData);
    } catch (err) {
      setError("Failed to fetch colleges. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (value: string) => setSearchData((prev) => {
      return {
        ...prev,
        school: {
          ...prev.school,
          state: value.toUpperCase().slice(0, 2),
        }
      };
    });
  };

  const handleZipChange = (value: string) => {
    const zipValue = value.replace(/\D/g, "");
    setSearchData((prev) => {
      const newSchool = { ...prev.school };
      newSchool.location = {
        ...newSchool.location,
        zip: zipValue || undefined
      };
      return {
        ...prev,
        school: newSchool
      };
    });
  };

  const handleDistanceChange = (value: string) => {
    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    setSearchData((prev) => {
      const newSchool = { ...prev.school };
      if (!newSchool.location) {
        newSchool.location = { distance: numericValue };
      } else {
        newSchool.location = {
          ...newSchool.location,
          distance: numericValue
        };
      }
      return {
        ...prev,
        school: newSchool
      };
    });
  };

  const handleCollegeTypeChange = (value: string) => {
    setSearchData((prev) => ({
      ...prev,
      school: {
        ...prev.school,
        ownership: value as "public" | "private non-profit" | "private for-profit"
      }
    }));
  };

  const handleInputChange = (name: string, value: string) => {
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    switch (name) {
      case "state":
        handleStateChange(value);
        break;
      case "zip":
        handleZipChange(value);
        break;
      case "distance":
        handleDistanceChange(value);
        break;
      case "collegeType":
        handleCollegeTypeChange(value);
        break;
      default:
        setSearchData((prev) => ({
          ...prev,
          [name]: value
        }));
    }
  };

  return (
    <main className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Find Your College Match</CardTitle>
          <CardDescription>
            Search for colleges based on location, test scores, and preferences
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="location" className="w-full">
          <CardContent className="pt-2">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="college">College Type</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSearch}>
              <TabsContent value="location" className="mt-0">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State (2 letters)</Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      value={searchData.school?.location?.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      maxLength={2}
                      className={errors.state ? "border-red-500" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code (numbers only)</Label>
                    <Input
                      id="zip"
                      placeholder="90210"
                      value={searchData.school?.location?.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      className={errors.zip ? "border-red-500" : ""}
                    />
                    {errors.zip && (
                      <p className="text-sm text-red-500">{errors.zip}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (miles)</Label>
                    <Input
                      id="distance"
                      placeholder="50"
                      value={searchData.school?.location?.distance}
                      onChange={(e) =>
                        handleInputChange("distance", e.target.value)
                      }
                      className={errors.distance ? "border-red-500" : ""}
                    />
                    {errors.distance && (
                      <p className="text-sm text-red-500">{errors.distance}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="academics" className="mt-0">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="sat">Minimum SAT Math Score (0-1600)</Label>
                    <Input
                      id="sat"
                      placeholder="1200"
                      type="number"
                      min="0"
                      max="1600"
                      value={searchData.admissions?.sat_scores?.math?.min}
                      onChange={(e) => handleInputChange("sat", e.target.value)}
                      className={errors.sat ? "border-red-500" : ""}
                    />
                    {errors.sat && (
                      <p className="text-sm text-red-500">{errors.sat}</p>
                    )}
                    <Label htmlFor="sat">Maximum SAT Math Score (0-1600)</Label>
                    <Input
                      id="sat"
                      placeholder="1200"
                      type="number"
                      min="0"
                      max="1600"
                      value={searchData.admissions?.sat_scores?.math?.max}
                      onChange={(e) => handleInputChange("sat", e.target.value)}
                      className={errors.sat ? "border-red-500" : ""}
                    />
                    {errors.sat && (
                      <p className="text-sm text-red-500">{errors.sat}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sat">
                      Minimum SAT Reading Score (0-1600)
                    </Label>
                    <Input
                      id="sat"
                      placeholder="1200"
                      type="number"
                      min="0"
                      max="1600"
                      value={searchData.admissions?.sat_scores?.reading?.min}
                      onChange={(e) => handleInputChange("sat", e.target.value)}
                      className={errors.sat ? "border-red-500" : ""}
                    />
                    {errors.sat && (
                      <p className="text-sm text-red-500">{errors.sat}</p>
                    )}
                    <Label htmlFor="sat">
                      Maximum SAT Reading Score (0-1600)
                    </Label>
                    <Input
                      id="sat"
                      placeholder="1200"
                      type="number"
                      min="0"
                      max="1600"
                      value={searchData.admissions?.sat_scores?.reading?.max}
                      onChange={(e) => handleInputChange("sat", e.target.value)}
                      className={errors.sat ? "border-red-500" : ""}
                    />
                    {errors.sat && (
                      <p className="text-sm text-red-500">{errors.sat}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sat">
                      Minimum SAT Writing Score (0-1600)
                    </Label>
                    <Input
                      id="sat"
                      placeholder="1200"
                      type="number"
                      min="0"
                      max="1600"
                      value={searchData.admissions?.sat_scores?.writing?.min}
                      onChange={(e) => handleInputChange("sat", e.target.value)}
                      className={errors.sat ? "border-red-500" : ""}
                    />
                    {errors.sat && (
                      <p className="text-sm text-red-500">{errors.sat}</p>
                    )}
                    <Label htmlFor="sat">
                      Maximum SAT Writing Score (0-1600)
                    </Label>
                    <Input
                      id="sat"
                      placeholder="1200"
                      type="number"
                      min="0"
                      max="1600"
                      value={searchData.admissions?.sat_scores?.writing?.max}
                      onChange={(e) => handleInputChange("sat", e.target.value)}
                      className={errors.sat ? "border-red-500" : ""}
                    />
                    {errors.sat && (
                      <p className="text-sm text-red-500">{errors.sat}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="act">Min ACT Score (0-36)</Label>
                    <Input
                      id="act"
                      placeholder="24"
                      type="number"
                      min="0"
                      max="36"
                      value={searchData.admissions?.act_scores?.cumulative.min}
                      onChange={(e) => handleInputChange("act", e.target.value)}
                      className={errors.act ? "border-red-500" : ""}
                    />
                    {errors.act && (
                      <p className="text-sm text-red-500">{errors.act}</p>
                    )}
                    <Label htmlFor="act">Max ACT Score (0-36)</Label>
                    <Input
                      id="act"
                      placeholder="24"
                      type="number"
                      min="0"
                      max="36"
                      value={searchData.admissions?.act_scores?.cumulative.max}
                      onChange={(e) => handleInputChange("act", e.target.value)}
                      className={errors.act ? "border-red-500" : ""}
                    />
                    {errors.act && (
                      <p className="text-sm text-red-500">{errors.act}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="college" className="mt-0">
                <div className="mb-4 max-w-sm">
                  <Label htmlFor="collegeType" className="mb-2 block">
                    College Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("collegeType", value)
                    }
                    defaultValue={searchData.school?.ownership}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select college type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private non-profit">
                        Private (Non-Profit)
                      </SelectItem>
                      <SelectItem value="private for-profit">
                        Private (For-Profit)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <Separator className="my-4" />

              <CardFooter className="px-0 pt-4 flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setSearchData({
                      paging: { page: 1, per_page: 100 },
                    });
                    setErrors({});
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  Search
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Tabs>
      </Card>
    </main>
  );
}
