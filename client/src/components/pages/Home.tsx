import { Link } from 'react-router-dom';

import { LoginButton } from '../buttons/LoginButton';
import { SignupButton } from '../buttons/SingupButton';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

function Home() {
  return (
    <>
      <div className="root-container">
        <Card className="w-[350px] mx-auto">
          <CardHeader>
            <CardTitle>Welcome to VetApp</CardTitle>
            <CardDescription>What do you want to do?</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between gap-2">
            <SignupButton className="grow basis-0" />
            <LoginButton className="grow basis-0" />
          </CardContent>
        </Card>
        <div className="root-grid mt-8">
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
          <p className="root-grid-item">papas</p>
        </div>
      </div>
      <Link to="/register">About</Link>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to VetApp</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

export { Home };
