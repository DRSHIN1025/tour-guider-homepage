"use client";
import React from "react";

type Props = { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) { 
    super(props); 
    this.state = { hasError: false }; 
  }
  
  static getDerivedStateFromError() { 
    return { hasError: true }; 
  }
  
  componentDidCatch(e: any) { 
    console.error(e); 
  }
  
  render() { 
    if (this.state.hasError) {
      return this.props.fallback || <div className="p-6">문제가 발생했어요. 잠시 뒤 다시 시도해 주세요.</div>;
    }
    return this.props.children; 
  }
}



