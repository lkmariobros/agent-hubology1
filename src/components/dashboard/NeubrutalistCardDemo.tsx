
import React from 'react';
import { Card } from "@/components/ui/component";

const NeubrutalistCardDemo = () => {
  return (
    <div className="p-8 bg-black">
      <Card 
        variant="neubrutalism" 
        className="max-w-[600px] mx-auto border-white/70"
        style={{ backgroundColor: "#161920" }}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Lorem ipsum dolor</h2>
          <p className="text-gray-300">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum, hic ipsum! 
            Qui dicta debitis aliquid quo molestias explicabo iure!
          </p>
        </div>
      </Card>
    </div>
  );
}

export default NeubrutalistCardDemo;
