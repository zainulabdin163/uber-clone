import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const HomeScreen = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
};

export default HomeScreen;
