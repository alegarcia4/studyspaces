// src/components/Navbar.tsx
// Using the version from the previous step which includes useNavigate and correct catch block.
// No changes needed here unless further UI refinement is desired.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, MapPin, LogOut, UserCircle, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingAuth, setLoadingAuth] = useState(false);

    const { user, session, signOut, signIn, signUp, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            setLoadingAuth(true);
            await signOut();
            toast({ title: "Signed Out", description: "You have been successfully signed out." });
            navigate("/");
        } catch (error: any) {
            console.error("Sign Out Error:", error);
            toast({ title: "Sign Out Error", description: error?.message || "Failed to sign out.", variant: "destructive" });
        } finally {
            setLoadingAuth(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAuth(true);
        try {
            await signIn(email, password);
            toast({ title: "Signed In", description: "Welcome back!" });
            setIsSignInOpen(false);
            setEmail("");
            setPassword("");
        } catch (error: any) {
            console.error("Sign In Error:", error);
             // Check Supabase specific error codes if available, otherwise use generic message
             if (error?.message?.includes('Invalid login credentials')) {
                 toast({ title: "Sign In Failed", description: "Invalid email or password.", variant: "destructive" });
             } else {
                 toast({ title: "Sign In Error", description: error?.message || "An unexpected error occurred.", variant: "destructive" });
             }
        } finally {
            setLoadingAuth(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAuth(true);
        try {
            await signUp(email, password);
            toast({ title: "Sign Up Successful", description: "Please check your email to verify your account." });
            setIsSignUpOpen(false);
            setEmail("");
            setPassword("");
        } catch (error: any) {
            console.error("Sign Up Error:", error);
            toast({ title: "Sign Up Error", description: error?.message || "Could not create account. Please try again.", variant: "destructive" });
        } finally {
            setLoadingAuth(false);
        }
    };

    const closeMobileMenu = () => setIsMenuOpen(false);
    const openSignInModal = () => { closeMobileMenu(); setIsSignUpOpen(false); setIsSignInOpen(true); setEmail(""); setPassword(""); };
    const openSignUpModal = () => { closeMobileMenu(); setIsSignInOpen(false); setIsSignUpOpen(true); setEmail(""); setPassword(""); };

    return (
        <>
            <nav className="bg-card shadow-sm sticky top-0 z-50 border-b border-border">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                            <MapPin className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">StudySpace</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">Home</Link>
                            <Link to="/spots" className="text-sm text-foreground hover:text-primary transition-colors">Find Spaces</Link>
                            <Link to="/submit" className="text-sm text-foreground hover:text-primary transition-colors">Add a Space</Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-accent hidden md:inline-flex"> <Search className="h-5 w-5" /> </Button>
                            {authLoading ? ( <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
                            ) : user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary text-primary-foreground text-xs"> {user.email?.charAt(0).toUpperCase() ?? 'U'} </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 bg-popover border-border" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none text-popover-foreground">Account</p>
                                                <p className="text-xs leading-none text-muted-foreground truncate"> {user.email} </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-popover-foreground focus:bg-accent focus:text-accent-foreground" disabled={loadingAuth}>
                                            <LogOut className="mr-2 h-4 w-4" /> <span>{loadingAuth ? "Signing Out..." : "Log out"}</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="hidden md:flex items-center gap-2">
                                    <Button variant="ghost" onClick={openSignInModal} className="text-sm text-foreground hover:text-primary hover:bg-accent"> <LogIn className="mr-2 h-4 w-4" /> Sign In </Button>
                                    <Button onClick={openSignUpModal} className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground"> <UserPlus className="mr-2 h-4 w-4" /> Sign Up </Button>
                                </div>
                            )}
                            <button className="md:hidden text-foreground p-1 -mr-1" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle mobile menu"> {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} </button>
                        </div>
                    </div>
                    {isMenuOpen && ( /* Mobile menu */
                         <div className="md:hidden py-4 mt-2 border-t border-border animate-fade-in">
                            <div className="flex flex-col gap-1">
                                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground" onClick={closeMobileMenu}> Home </Link>
                                <Link to="/spots" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground" onClick={closeMobileMenu}> Find Spaces </Link>
                                <Link to="/submit" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground" onClick={closeMobileMenu}> Add a Space </Link>
                                <div className="pt-4 mt-4 border-t border-border">
                                    {user ? ( <> {/* Mobile logged in */} </>
                                    ) : ( <div className="space-y-2 px-3"> {/* Mobile logged out */}
                                            <Button variant="ghost" onClick={openSignInModal} className="w-full justify-start text-base font-medium"> <LogIn className="mr-2 h-4 w-4" /> Sign In </Button>
                                            <Button onClick={openSignUpModal} className="w-full text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"> <UserPlus className="mr-2 h-4 w-4" /> Sign Up </Button>
                                         </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Sign In Dialog */}
            <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
                 <DialogContent className="sm:max-w-[425px] bg-card border-border">
                     <DialogHeader> <DialogTitle className="text-foreground">Sign In</DialogTitle> <DialogDescription className="text-muted-foreground">Enter your credentials to access your account.</DialogDescription> </DialogHeader>
                     <form onSubmit={handleSignIn}> <div className="grid gap-4 py-4"> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="signin-email" className="text-right text-foreground">Email</Label> <Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3 bg-input border-border text-foreground placeholder:text-muted-foreground" required placeholder="you@example.com" /> </div> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="signin-password" className="text-right text-foreground">Password</Label> <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3 bg-input border-border text-foreground" required placeholder="••••••••" /> </div> </div> <DialogFooter> <Button type="submit" disabled={loadingAuth || !email || !password} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"> {loadingAuth ? "Signing In..." : "Sign In"} </Button> </DialogFooter> </form>
                     <p className="text-center text-sm text-muted-foreground mt-4"> Don't have an account?{" "} <Button variant="link" className="p-0 h-auto text-primary" onClick={openSignUpModal}>Sign Up</Button> </p>
                 </DialogContent>
            </Dialog>

            {/* Sign Up Dialog */}
            <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
                 <DialogContent className="sm:max-w-[425px] bg-card border-border">
                     <DialogHeader> <DialogTitle className="text-foreground">Sign Up</DialogTitle> <DialogDescription className="text-muted-foreground">Create a new account to join StudySpace.</DialogDescription> </DialogHeader>
                     <form onSubmit={handleSignUp}> <div className="grid gap-4 py-4"> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="signup-email" className="text-right text-foreground">Email</Label> <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3 bg-input border-border text-foreground placeholder:text-muted-foreground" required placeholder="you@example.com" /> </div> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="signup-password" className="text-right text-foreground">Password</Label> <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3 bg-input border-border text-foreground" required placeholder="Choose a strong password" /> </div> </div> <DialogFooter> <Button type="submit" disabled={loadingAuth || !email || !password} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"> {loadingAuth ? "Creating Account..." : "Sign Up"} </Button> </DialogFooter> </form>
                     <p className="text-center text-sm text-muted-foreground mt-4"> Already have an account?{" "} <Button variant="link" className="p-0 h-auto text-primary" onClick={openSignInModal}>Sign In</Button> </p>
                 </DialogContent>
             </Dialog>
        </>
    );
};

export default Navbar;