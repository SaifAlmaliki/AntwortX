'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className="h-full min-h-0 w-full" aria-hidden="true">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <span className="loader" aria-hidden />
          </div>
        }
      >
        {/* Decorative 3D scene; copy lives in sibling text (see code.demo). */}
        <Spline scene={scene} className={className} />
      </Suspense>
    </div>
  );
}
