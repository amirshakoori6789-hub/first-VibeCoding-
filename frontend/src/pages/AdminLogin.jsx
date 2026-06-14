import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '@/lib/adminAuth';
import { Lock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (adminLogin(username, password)) {
      navigate('/admin/panel');
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4">
            <span className="text-white font-black text-2xl">آ</span>
          </div>
          <h1 className="text-2xl font-bold text-white">پنل مدیریت</h1>
          <p className="text-gray-400 text-sm mt-2">آسا پمپ</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-5">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-[#334155] block mb-2">نام کاربری</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="نام کاربری"
                className="pr-10"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#334155] block mb-2">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="رمز عبور"
                className="pr-10"
              />
            </div>
          </div>
          <Button type="submit" className="w-full py-6 text-base rounded-xl">
            ورود به پنل
          </Button>
        </form>
      </div>
    </div>
  );
}