import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available_days: string;
  start_hour: number;
  end_hour: number;
}

export const DoctorsList = () => {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Doctor[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-2/3 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors?.map((doctor) => (
        <Card key={doctor.id} className="p-6 hover:shadow-medium transition-shadow">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
              <Badge variant="secondary" className="mb-3">
                {doctor.specialty}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{doctor.available_days}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {doctor.start_hour}:00 - {doctor.end_hour}:00
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge className="bg-success text-success-foreground">
                Available
              </Badge>
              <Button size="sm">Book Now</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
