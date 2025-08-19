'use client'
import React from 'react';
export class ErrorBoundary extends React.Component<{label:string,children:React.ReactNode},{hasError:boolean;error?:any}> {
  constructor(p:any){ super(p); this.state={hasError:false}; }
  static getDerivedStateFromError(error:any){ return {hasError:true,error}; }
  componentDidCatch(error:any, info:any){ console.error('[SectionError]', this.props.label, error, info); }
  render(){ return this.state.hasError
    ? <div style={{padding:12, border:'1px solid #f00', background:'#fff0f0', borderRadius:8, margin:'12px 0'}}>섹션 오류: {this.props.label}</div>
    : this.props.children as any }
}
