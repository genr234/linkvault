"use client";

import { Link } from "@/types";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createLink, deleteLink, getAllLinks } from "../actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  number: z.string().min(1).max(4),
  type: z.string().nonempty(),
  content: z.string().nonempty(),
});

export default function AdminPage() {
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "1",
      type: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newValues = {
      ...values,
      number: parseInt(values.number),
    };

    const result = await createLink(newValues);
    if (!result) {
      toast({
        variant: "destructive",
        description: "Oops, looks like there was an error!",
      });
    } else if (result.success) {
      form.reset();
      setLinks((prevLinks) => {
        let newId: number;
        if (prevLinks[prevLinks.length]?.id !== undefined) {
          newId = (prevLinks[prevLinks.length]?.id as number) + 1;
        } else {
          newId = 1;
        }
        const updatedLinks = [
          ...prevLinks,
          {
            id: newId,
            ...newValues,
          },
        ];
        return updatedLinks.sort((a, b) => a.number - b.number);
      });
      toast({
        description: "Link added!",
      });
    } else if (!result.success) {
      toast({
        variant: "destructive",
        description: result.message,
      });
    }
  };

  useEffect(() => {
    getAllLinks().then((r) => {
      if (r) {
        setLinks(r.sort((a, b) => a.number - b.number));
      } else {
        setLinks([]);
      }
    });
  }, []);

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
        <div className="flex justify-between w-full mb-4">
          <h1 className="font-extrabold text-3xl md:text-5xl text-center">
            Links
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon">
                <Plus />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Link</SheetTitle>
                <SheetDescription>
                  Add a new link to the database
                </SheetDescription>
              </SheetHeader>
              <div className="py-4" />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the number users will enter to access the link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select one of the following types" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="url">Link</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="string">Text</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This is the type of the link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the content of the link
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Content</TableHead>
              <TableHead className="w-10">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => {
              return (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.number}</TableCell>
                  <TableCell>{link.type}</TableCell>
                  <TableCell className="text-right">{link.content}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="p-2"
                      onClick={async () => {
                        const result = await deleteLink(link);
                        if (!result) {
                          toast({
                            variant: "destructive",
                            description: "Oops, looks like there was an error!",
                          });
                        } else if (result.success) {
                          setLinks((prevLinks) => {
                            const updatedLinks = prevLinks.filter(
                              (l) => l.id !== link.id
                            );
                            return updatedLinks.sort(
                              (a, b) => a.number - b.number
                            );
                          });
                          toast({
                            description: "Link deleted!",
                          });
                        } else {
                          toast({
                            variant: "destructive",
                            description: result.message,
                          });
                        }
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
