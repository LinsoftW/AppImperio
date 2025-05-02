import AuthStack from './AuthStack';
import UserStack from './UserStack';
import AnonymousStack from './AnonymousStack';
import { useUser } from '../screens/UserContext';

export default function NavigationHandler() {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {!user ? (
        <AuthStack />
      ) : user.esAnonimo ? (
        <AnonymousStack />
      ) : (
        <UserStack />
      )}
    </>
  );
}