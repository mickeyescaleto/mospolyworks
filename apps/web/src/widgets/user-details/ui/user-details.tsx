import { UserProjects } from '@/widgets/user-details/ui/user-projects';

type UserDetailsProps = {
  user: {
    id: string;
  };
};

export function UserDetails({ user }: UserDetailsProps) {
  return <UserProjects userId={user.id} />;
}
