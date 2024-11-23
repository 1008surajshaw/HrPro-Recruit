'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button"
import { Loader2, Wand2 } from 'lucide-react'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { improveText } from '@/actions/textgeneration.action';

interface DescriptionEditorProps {
  fieldName: string;
  initialValue?: string;
  onDescriptionChange: (fieldName: string, content: string) => void;
  placeholder?: string;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
  fieldName,
  initialValue = '',
  onDescriptionChange,
  placeholder = '',
}) => {
  const [description, setDescription] = useState(initialValue || '');
  const [wordCount, setWordCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setDescription(initialValue || '');
    setWordCount(countWords(initialValue));
  }, [initialValue]);

  const handleChange = (content: string) => {
    setDescription(content);
    setWordCount(countWords(content));
    onDescriptionChange(fieldName, content);
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  

  const generateDescription = async () => {
    setIsGenerating(true);
    try {
      const improvedText = await improveText(description,'description',false);
      // const improvedText = truncateToWords(improvedText, 300);
      setDescription(improvedText);
      setWordCount(countWords(improvedText));
      onDescriptionChange(fieldName, improvedText);
    } catch (error) {
      console.error('Error generating description:', error);
    } finally {
      setIsGenerating(false);
    }
  };


  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: '1' }, { header: '2' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  const formats = [
    'bold',
    'italic',
    'underline',
    'header',
    'list',
    'bullet',
    'link',
  ];

  return (
    <div className="relative" data-text-editor={fieldName}>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={description}
        onChange={handleChange}
        placeholder={placeholder}
        bounds={`[data-text-editor="${fieldName}"]`}
        className="dark:text-white dark:bg-gray-800  job-description-editor text-wrap max-w-full min-h-[200px] overflow-x-hidden"
      />
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">{wordCount} words</span>
        <Button
          variant="outline"
          size="sm"
          onClick={generateDescription}
          disabled={wordCount < 1 || isGenerating}
          className="bg-background hover:bg-accent"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          <span className="sr-only">Generate description</span>
        </Button>
      </div>
    </div>
  );
};

export default DescriptionEditor;