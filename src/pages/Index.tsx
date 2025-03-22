
import React from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Lovable</h1>
      <p className="text-lg mb-6">This application has been updated to the latest version.</p>
      <div className="flex gap-4">
        <Button variant="default">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
      </div>
    </div>
  );
};

export default Index;
