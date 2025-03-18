
import React from 'react';
import AuthForm from '../components/AuthForm';

const Index = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(102, 90, 240, 0.15) 0%, rgba(0, 0, 0, 0.5) 100%)',
      }}
    >
      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[100px] animate-float" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-property-purple/5 blur-[80px] animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-property-pink/5 blur-[90px] animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 w-full max-w-screen-xl px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left space-y-6 animate-fadeIn">
            <div className="inline-block bg-accent/10 backdrop-blur-md rounded-full px-3 py-1 mb-4 border border-accent/20">
              <span className="text-xs text-accent">Premium Property Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Property Agency Management System
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
              Streamline your property management operations with our intuitive, elegant platform designed for modern agencies.
            </p>
            <div className="hidden md:block">
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-property-blue/10 flex items-center justify-center">
                    <span className="text-property-blue">✓</span>
                  </div>
                  <span className="text-sm">Property Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-property-purple/10 flex items-center justify-center">
                    <span className="text-property-purple">✓</span>
                  </div>
                  <span className="text-sm">Commission Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-property-pink/10 flex items-center justify-center">
                    <span className="text-property-pink">✓</span>
                  </div>
                  <span className="text-sm">Team Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-property-orange/10 flex items-center justify-center">
                    <span className="text-property-orange">✓</span>
                  </div>
                  <span className="text-sm">Advanced Reporting</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:ml-auto w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
