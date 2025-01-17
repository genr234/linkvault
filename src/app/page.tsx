"use client";

import { Input } from "@/components/ui/input";
import { checkLink, getUserData } from "./actions";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Numpad } from "@/components/numpad";
import { MonitorCog } from "lucide-react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti-boom";

export default function Home() {
  const [username, setUsername] = useState("Loading... ");
  const [number, setNumber] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async () => {
    const number = (document.getElementById("search-bar") as HTMLInputElement)
      .value;
    toast({ description: "Looking up link..." });
    await checkLink(parseInt(number))
      .then((r) => {
        if (r.found) {
          router.push(`/${number}`);
        } else {
          toast({
            variant: "destructive",
            description: r.message,
          });
        }
      })
      .catch(() =>
        toast({
          variant: "destructive",
          description: "There was an error with the request",
        })
      );
  };

  useEffect(() => {
    getUserData().then((r) => {
      setUsername(r.username);
    });
  }, []);

  return (
    <>
      <div className="absolute top-4 right-4 bg-white rounded-md p-2">
        <MonitorCog
          size={24}
          onClick={() => {
            router.push("/admin");
          }}
          className="hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200 ease-in-out transform hover:scale-110"
        />
      </div>
      <div className="flex items-center justify-center min-h-screen flex-col w-full px-4 md:px-44 overflow-hidden">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          {username}&apos;s Links
        </h1>
        <div className="py-4" />
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="number"
            id="search-bar"
            disabled
            value={number}
            className="bg-white"
          />
        </div>
        <div className="py-4" />
        <Numpad onSubmit={handleSubmit} value={number} onChange={setNumber} />
      </div>
    </>
  );
}
