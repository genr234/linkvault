"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/actions";

const formSchema = z.object({
  username: z.string().min(2).max(32),
  password: z.string().min(8).max(64),
});

export default function LogInPage() {
  const [joke, setJoke] = useState<string>("Loading...");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "text/plain",
      },
    })
      .then((r) => r.text())
      .then((r) => setJoke(r))
      .catch((r: string) => {
        setJoke(`No joke for you :( Reason: ${r}`);
      });
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signIn(values);
  };
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
        <Card>
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>Log in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <CardDescription className="text-xs">{joke}</CardDescription>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
