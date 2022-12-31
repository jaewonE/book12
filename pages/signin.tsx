import { useState } from 'react';

export default function Signin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div className="w-full h-full flex justify-center items-center bg-red-300">
      <form className="w-32 h-96">
        <input
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
    </div>
  );
}
