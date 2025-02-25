import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AvatarSelector } from "@/components/avatar-selector";
import { useLocation } from "wouter";

// Define the signup schema
const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().min(1, "Please select an avatar")
});

type SignupFormData = z.infer<typeof signupSchema>;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

export default function AuthPage() {
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [, setLocation] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setLocation("/home");
    }
  }, [setLocation]);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      avatar: ""
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Check if username already exists
      const existingData = localStorage.getItem('userData');
      if (existingData) {
        const existing = JSON.parse(existingData);
        if (existing.username === data.username) {
          throw new Error("Username already taken");
        }
      }

      // Store user data in localStorage
      const userData = {
        ...data,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      toast({
        title: "Welcome aboard!",
        description: "Your account has been created successfully.",
      });

      // Navigate to home page after successful signup
      setLocation("/home");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Update form when avatar is selected
  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    form.setValue("avatar", avatar);
  };

  const features = [
    "Real-time market data and trends",
    "Social sentiment analysis",
    "Community discussions and insights",
    "Personalized market alerts"
  ];

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">
                Create Your Account
              </h1>
              <p className="text-muted-foreground">
                Join our community and start exploring
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-4">Choose your avatar</h2>
                  <AvatarSelector
                    selectedAvatar={selectedAvatar}
                    onSelect={handleAvatarSelect}
                  />
                  {form.formState.errors.avatar && (
                    <p className="text-sm text-destructive mt-2">
                      {form.formState.errors.avatar.message}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </Form>
          </Card>
        </motion.div>

        <motion.div
          className="hidden md:flex flex-col justify-center"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold mb-4">
            Track Crypto Market Insights
          </h2>
          <p className="text-muted-foreground mb-6">
            Get real-time cryptocurrency market data, social sentiment analysis,
            and community insights all in one place.
          </p>
          <motion.ul
            className="space-y-4"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-2"
                variants={listItemVariants}
              >
                <span className="text-primary">✓</span>
                {feature}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.div>
  );
}