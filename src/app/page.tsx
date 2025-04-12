"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";

const coverImages = ["/coverimg1.jpg", "/coverimg2.jpg", "/coverimg3.jpg", "/coverimg4.jpg"];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1 % coverImages.length);
  const [transitioning, setTransitioning] = useState(false);
  const baseOpacity = 0.5; // Your desired base opacity

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % coverImages.length);
        setNextImageIndex((prevIndex) => (prevIndex + 2) % coverImages.length);
        setTransitioning(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-background py-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          key={coverImages[currentImageIndex]}
          src={coverImages[currentImageIndex]}
          alt="College Campus"
          layout="fill"
          objectFit="cover"
          style={{
            opacity: transitioning ? 0 : baseOpacity,
            transition: 'opacity 1s ease-in-out',
          }}
          className="absolute inset-0" 
        />
        <Image
          key={coverImages[nextImageIndex]}
          src={coverImages[nextImageIndex]}
          alt="College Campus"
          layout="fill"
          objectFit="cover"
          style={{
            opacity: transitioning ? baseOpacity : 0,
            transition: 'opacity 1s ease-in-out',
          }}
          className="absolute inset-0" // Remove opacity-0 from here
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-5xl text-center p-6">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl text-primary">
          Welcome to CollegeConnect
        </h1>
        <p className="mt-4 text-lg">
          A platform to help students find the right college.
        </p>
      </div>

      <section className="relative z-10 container grid gap-6 py-10 px-4 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our sophisticated college finding algorithm gives YOU the best recommendations based on your preferences.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Filter Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Filter based off dozens of criteria including location, size, and major.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Discover detailed information about colleges, including tuition, acceptance rates, and campus life.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <div className="relative z-10">
  <Link href="/search" className="pb-4">
    <Button className="w-full max-w-xs bg-primary hover:bg-primary-foreground text-primary-foreground hover:text-gray-400">
      Get Started
    </Button>
  </Link>
  <Link href="/report">
      <Button className="w-full max-w-xs bg-primary hover:bg-primary-foreground text-primary-foreground hover:text-gray-400">
        See Something Wrong?
      </Button>
  </Link>
</div>
    </main>
  );
}