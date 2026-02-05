import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    // 1. Add a state to store the role
    const [userRole, setUserRole] = useState(null); 

    // Helper function to fetch the role from the database
    const fetchUserRole = async (userId) => {
  if (!userId) {
    setUserRole(null);
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching role:", error.message);
    setUserRole("user"); // safe default
    return;
  }

  setUserRole(data.role || "user");
};


    // 3. Update the initial login check to also fetch the role
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
            if (session) {
                fetchUserRole(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchUserRole(session.user.id);
            } else {
                setUserRole(null);
            }
        })

        return () => subscription.unsubscribe();
    },[])

    // Sign Up (Kept as is)
    const  signUpNewUser = async (email, password) => {
        const{data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if(error) {
            console.error("There was a problem signing up: ", error);
            return { success: false, error };
        }
        return { success: true, data };
    };

    // Sign In (Kept as is)
    const signInUser = async (email, password) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (error) {
                console.error("Sign in error orccured: ", error)
                return{success: false, error: error.message};
            }
            console.log("sign-in success: ", data);
            return { success: true, data };
        } catch (error) {
            console.error("An error occured: ", error)
        }
    };

    // Sign Out (Kept as is)
    const signOut = () => {
        const{error} = supabase.auth.signOut();
        if(error) {
            console.errorr("There was an error: ", error)
        }
    };

    return (
        // 4. Add userRole to the value object so AdminRoute can see it
        <AuthContext.Provider value={{ session, userRole, signUpNewUser, signInUser, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}
