import React from 'react';
import { DiReact, DiNodejs, DiMongodb, DiHtml5, DiCss3, DiJavascript, DiPython } from 'react-icons/di';
import { RiNextjsFill } from "react-icons/ri";
import { SiHuggingface, SiTailwindcss } from "react-icons/si";

const PoweredBy: React.FC = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem'}}>
      <h3>Powered By</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <SiHuggingface size={30} title="HuggingFace" />
        <SiTailwindcss size={30} title="Tailwind CSS" />
        <RiNextjsFill size={30} title="Next.js" />
        <DiReact size={30} title="React" />
        <DiJavascript size={30} title="JavaScript" />
        <DiPython size={30} title="Python" />
      </div>
    </footer>
  );
};

export default PoweredBy;