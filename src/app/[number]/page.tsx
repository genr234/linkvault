"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLink } from "../actions";
import { memo, NamedExoticComponent, use, useEffect, useState } from "react";
import { Link } from "@/types";
import { Progress } from "@/components/ui/progress";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Confetti from "react-confetti-boom";

export default function LinkPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const router = useRouter();
  const [link, setLink] = useState<Link | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [Content, setContent] = useState<NamedExoticComponent>(() =>
    memo(function Empty() {
      return <></>;
    })
  );
  const { number } = use(params);
  useEffect(() => {
    getLink(parseInt(number)).then((r) => {
      if (!r.link) {
        router.push("/");
      } else {
        setLink(r.link);
        setLoading(false);
      }
    });
  }, [number, router]);

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 100 : prevProgress + 2
        );
      }, 100);
      return () => clearInterval(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (link?.type === "string") {
      setContent(() =>
        memo(function StringContent() {
          return (
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl italic text-center">
              &ldquo;{link.content}&rdquo;
            </h1>
          );
        })
      );
    } else if (link?.type === "image") {
      setContent(() =>
        memo(function ImageContent() {
          return (
            <PhotoProvider>
              <PhotoView src={link.content}>
                <img
                  src={link.content}
                  alt={link.content}
                  className="scroll-m-20 w-full h-auto max-w-4xl"
                />
              </PhotoView>
            </PhotoProvider>
          );
        })
      );
    } else if (link?.type === "video") {
      setContent(() =>
        memo(function VideoContent() {
          return (
            // biome-ignore lint/a11y/useMediaCaption: User provided video
            <video
              src={link.content}
              controls
              className="scroll-m-20 w-full h-auto max-w-4xl"
            />
          );
        })
      );
    }
  }, [link]);

  useEffect(() => {});
  if (loading) {
    return (
      <>
        <div className="absolute top-4 left-4">
          <ArrowLeft
            className="hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200 ease-in-out transform hover:scale-110"
            onClick={() => {
              router.push("/");
            }}
          />
        </div>
        <div className="flex items-center justify-center min-h-screen flex-col w-full px-4 md:px-44 overflow-hidden">
          <Progress value={progress} />
        </div>
      </>
    );
  }
  if (link?.type === "url") {
    window.location.href = link?.content;
    return <></>;
  }
  return (
    <>
      <Confetti
        mode="boom"
        particleCount={75}
        shapeSize={20}
        effectCount={3}
        effectInterval={300}
        launchSpeed={2}
        colors={Array.from(
          { length: 5 },
          () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        )}
      />
      <div className="absolute top-4 left-4">
        <ArrowLeft
          className="hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200 ease-in-out transform hover:scale-110"
          onClick={() => {
            router.push("/");
          }}
        />
      </div>
      <div className="flex items-center justify-center min-h-screen flex-col w-full px-4 md:px-44 overflow-hidden">
        <Content />
      </div>
    </>
  );
}
