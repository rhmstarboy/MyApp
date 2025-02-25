import { useState } from "react";
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
import { insertUserSchema } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { VerificationInput } from "@/components/otp-input";

// Extend the user schema with password confirmation
const authSchema = insertUserSchema.extend({
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

type AuthFormData = z.infer<typeof authSchema>;

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
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 }
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
  const [isLogin, setIsLogin] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { loginMutation, registerMutation } = useAuth();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        loginMutation.mutate({
          username: data.username,
          password: data.password,
        });
      } else {
        setEmail(data.email);
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }

        toast({
          title: "Verification Required",
          description: "Please check your email for the verification code.",
        });
        setShowVerification(true);
      }
    } catch (error) {
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleVerification = async () => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: verificationCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const user = await response.json();
      toast({
        title: "Success",
        description: "Your account has been verified successfully!",
      });

      // After verification, log the user in
      loginMutation.mutate({
        username: user.username,
        password: form.getValues("password"),
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  const features = [
    "Real-time market data and trends",
    "Social sentiment analysis",
    "Community discussions and insights",
    "Personalized market alerts"
  ];

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : (showVerification ? "verify" : "register")}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="p-6">
              {showVerification ? (
                <div>
                  <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
                  <p className="text-muted-foreground mb-6">
                    Enter the verification code sent to your email
                  </p>
                  <div className="space-y-6">
                    <VerificationInput
                      value={verificationCode}
                      onChange={setVerificationCode}
                      isDisabled={registerMutation.isPending}
                    />
                    <Button 
                      className="w-full"
                      onClick={handleVerification}
                      disabled={verificationCode.length !== 6 || registerMutation.isPending}
                    >
                      Verify Account
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                      {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-muted-foreground">
                      {isLogin
                        ? "Sign in to access your account"
                        : "Join our community and start exploring"}
                    </p>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                      {!isLogin && (
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

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

                      {!isLogin && (
                        <FormField
                          control={form.control}
                          name="passwordConfirm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLogin ? "Sign In" : "Create Account"}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setShowVerification(false);
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      {isLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

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