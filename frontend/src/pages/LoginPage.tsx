import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Вход для Администратора</CardTitle>
          <CardDescription>
            Введите email и пароль для доступа к панели управления.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="example@mail.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full">Войти</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;