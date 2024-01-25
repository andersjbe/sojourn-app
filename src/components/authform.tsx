"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { handleLogin, handleSignUp } from "~/lib/auth/actions";
import { emailPasswordSchema, signUpSchema } from "~/lib/validators";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function AuthForm() {
	return (
		<Tabs defaultValue="login" className="max-w-md">
			<TabsList className="w-full grid grid-cols-2">
				<TabsTrigger value="login">Log In</TabsTrigger>
				<TabsTrigger value="signup">Sign Up</TabsTrigger>
			</TabsList>
			<TabsContent value="login">
				<Card>
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>
							Been here before? Welcome back! Enter your email and password
							below to continue
						</CardDescription>
					</CardHeader>
					<CardContent>
						<LoginForm />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="signup">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Sign Up</CardTitle>
						<CardDescription>
							First time? Welcome! Enter your information below to get started.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SignUpForm />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}

function LoginForm() {
	const form = useForm<z.infer<typeof emailPasswordSchema>>({
		resolver: zodResolver(emailPasswordSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof emailPasswordSchema>) => {
		const result = await handleLogin(values);
		if (!result.success) {
			form.setError("root", { message: result.message });
		}
	};

	return (
		<Form {...form}>
			<form
				className="space-y-2"
				onSubmit={form.handleSubmit((data) => onSubmit(data))}
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="wanderer@email.com"
									{...field}
								/>
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
								<Input
									type="password"
									required
									placeholder="password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
				{form.formState.errors.root && (
					<p className="text-sm font-medium text-destructive">
						{form.formState.errors.root.message}
					</p>
				)}
			</form>
		</Form>
	);
}

function SignUpForm() {
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
		console.log(values);

		const result = await handleSignUp(values);
		if (!result.success) {
			form.setError("root", { message: result.message });
		} else {
			console.log("success");
		}
	};

	return (
		<Form {...form}>
			<form
				className="space-y-2"
				onSubmit={form.handleSubmit((data) => onSubmit(data))}
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="wanderer@email.com"
									{...field}
								/>
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
								<Input
									type="password"
									required
									placeholder="password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
				{form.formState.errors.root && (
					<p className="text-sm font-medium text-destructive">
						{form.formState.errors.root.message}
					</p>
				)}
			</form>
		</Form>
	);
}
