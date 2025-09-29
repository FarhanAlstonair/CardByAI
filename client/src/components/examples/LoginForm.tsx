import LoginForm from '../auth/LoginForm';

export default function LoginFormExample() {
  return (
    <LoginForm 
      onGoogleLogin={() => console.log('Google login clicked')}
      onEmailLogin={(email, password) => console.log('Email login:', email, password)}
    />
  );
}