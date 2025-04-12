"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";

const coverImages = [
  "/coverimg1.jpg",
  "/coverimg2.jpg",
  "/coverimg3.jpg",
  "/coverimg4.jpg",
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(
    1 % coverImages.length
  );
  const [transitioning, setTransitioning] = useState(false);
  const baseOpacity = 0.4;

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
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <Image
          key={coverImages[currentImageIndex]}
          src={coverImages[currentImageIndex]}
          alt="College Campus"
          fill
          className="object-cover transition-opacity duration-1000"
          style={{
            opacity: transitioning ? 0 : baseOpacity,
          }}
        />
        <Image
          key={coverImages[nextImageIndex]}
          src={coverImages[nextImageIndex]}
          alt="College Campus"
          fill
          className="object-cover transition-opacity duration-1000"
          style={{
            opacity: transitioning ? baseOpacity : 0,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl px-6 pt-16 pb-10 text-center backdrop-blur-xs">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
          Welcome to CollegeConnect
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A platform to help students find the right college.
        </p>
      </div>

      <section className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our sophisticated algorithm gives you tailored college suggestions
              based on your preferences.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Filter Colleges</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Filter colleges by dozens of criteria like location, size, majors,
              and more.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Comprehensive Info</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Explore tuition costs, acceptance rates, student life, and everything
              you need to know.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Buttons */}
      <div className="relative z-10 mt-6 mb-16 flex flex-col items-center gap-4 px-4">
        <Link href="/search" className="w-full max-w-xs">
          <Button
            variant="default"
            className="w-full rounded-xl bg-primary text-white hover:bg-primary/90 text-base font-semibold bg-green-800"
          >
            Get Started
          </Button>
        </Link>

        <Link href="/report" className="w-full max-w-xs">
          <Button
            variant="outline"
            className="w-full rounded-xl text-base font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            See Something Wrong?
          </Button>
        </Link>
      </div>
    </main>
  );
}
