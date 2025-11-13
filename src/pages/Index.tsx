import { useState } from "react";
import { MessageSquare, Stethoscope, Calendar, Clock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { DoctorsList } from "@/components/doctors/DoctorsList";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light/30 to-background">
      {/* Hero Section */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">HospitalCare</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setShowChat(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button variant="ghost" asChild>
              <a href="/admin">Admin</a>
            </Button>
            <Button variant="default" asChild>
              <a href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Healthcare Made <span className="text-gradient">Simple</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book appointments, search doctors, get answers to your health questions - all through our intelligent chatbot assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg h-14 px-8" onClick={() => setShowChat(true)}>
              <MessageSquare className="h-5 w-5 mr-2" />
              Start Chatting
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8">
              View Doctors
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-muted-foreground">
              Schedule appointments with our specialists in seconds through natural conversation.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Stethoscope className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
            <p className="text-muted-foreground">
              Search and connect with qualified specialists across multiple medical fields.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <div className="bg-success/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-muted-foreground">
              Get instant answers to your questions anytime, anywhere with our AI assistant.
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Specialists</h2>
            <p className="text-lg text-muted-foreground">
              Meet our experienced team of healthcare professionals
            </p>
          </div>
          <DoctorsList />
        </div>
      </section>

      {/* Chat Interface Modal */}
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Index;
