import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  days: string;
  hours: string;
  availability: string;
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    days: "Mon - Fri",
    hours: "9:00 AM - 5:00 PM",
    availability: "Available",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Orthopedics",
    days: "Mon - Thu",
    hours: "10:00 AM - 6:00 PM",
    availability: "Available",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    days: "Tue - Sat",
    hours: "8:00 AM - 4:00 PM",
    availability: "Available",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Neurology",
    days: "Mon - Wed",
    hours: "11:00 AM - 7:00 PM",
    availability: "Limited",
  },
  {
    id: "5",
    name: "Dr. Priya Patel",
    specialty: "General Medicine",
    days: "Mon - Fri",
    hours: "9:00 AM - 6:00 PM",
    availability: "Available",
  },
];

export const DoctorsList = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
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
                <span>{doctor.days}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{doctor.hours}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge
                variant={doctor.availability === "Available" ? "default" : "secondary"}
                className={
                  doctor.availability === "Available"
                    ? "bg-success text-success-foreground"
                    : ""
                }
              >
                {doctor.availability}
              </Badge>
              <Button size="sm">Book Now</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
