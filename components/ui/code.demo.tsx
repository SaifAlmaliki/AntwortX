'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Squares } from "@/components/ui/squares-background"
import { useLanguage } from "@/contexts/language-context";
import { BrandName } from "@/components/ui/BrandName";
 
export function SplineSceneBasic() {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  
  return (
    <Card className="w-full h-[400px] sm:h-[450px] md:h-[500px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className={`flex flex-col md:flex-row h-full ${isRtl ? 'md:flex-row-reverse' : ''}`}>
        {/* Left content */}
        <div className={`flex-1 p-4 sm:p-6 md:p-8 relative z-10 flex flex-col justify-center ${isRtl ? 'text-right' : ''}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            {t("hero.title") || "Customer Service Reimagined"}
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-300 max-w-lg">
            {(() => {
              const description = t("hero.description") || "Intelligent Proxy combines AI intelligence with human empathy to deliver exceptional customer service experiences that build loyalty and trust.";
              if (description.includes('Intelligent Proxy')) {
                const parts = description.split('Intelligent Proxy');
                return (
                  <>
                    {parts[0]}<BrandName size="sm" />{parts[1]}
                  </>
                );
              }
              return description;
            })()}
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative h-[200px] md:h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}

export function SquaresDemo() {
  return (
    <div className="space-y-8">
      <div className="relative h-[400px] rounded-lg overflow-hidden bg-[#060606]">
        <Squares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333" 
          hoverFillColor="#222"
        />
      </div>
    </div>
  )
}
