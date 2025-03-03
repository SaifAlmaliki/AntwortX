"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, File, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type ExtractedQuestion = {
  id: string;
  question: string;
  answer: string;
  selected: boolean;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestion[]>([]);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only accept the first file
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Simulate file upload to server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("File uploaded successfully!");
      setIsUploading(false);
      setIsProcessing(true);
      
      // Process the file to extract questions (simulated for now)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock extracted questions
      const mockQuestions: ExtractedQuestion[] = [
        { id: "1", question: "How do I reset my password?", answer: "Click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.", selected: true },
        { id: "2", question: "What payment methods do you accept?", answer: "We accept credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers.", selected: true },
        { id: "3", question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.", selected: true },
        { id: "4", question: "Can I return an item?", answer: "Yes, you can return items within 30 days of purchase. Please visit our returns page for more information.", selected: true },
        { id: "5", question: "How do I contact customer support?", answer: "You can contact our customer support team via email at support@example.com or by phone at 1-800-123-4567.", selected: true },
      ];
      
      setExtractedQuestions(mockQuestions);
      setIsProcessing(false);
      setShowQuestionsDialog(true);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file. Please try again.");
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const toggleQuestionSelection = (id: string) => {
    setExtractedQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, selected: !q.selected } : q)
    );
  };

  const handleAddToKnowledgeBase = async () => {
    const selectedQuestions = extractedQuestions.filter(q => q.selected);
    
    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question to add to the knowledge base.");
      return;
    }
    
    try {
      // Simulate adding to knowledge base
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${selectedQuestions.length} questions added to knowledge base!`);
      setShowQuestionsDialog(false);
      setFile(null);
      
    } catch (error) {
      toast.error("Failed to add questions to knowledge base. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-[#0a0a0a] border-b border-[#222] py-4 px-6">
        <div className="container mx-auto flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#1a1a1a]">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-4 text-white">Build Knowledge Base</h1>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto bg-[#0a0a0a] border-[#222] shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Upload Document</CardTitle>
            <CardDescription className="text-gray-400">
              Upload a document containing your FAQs and knowledge base articles.
              Our AI will extract questions and answers to power your customer support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? "border-blue-500 bg-[#101020]" 
                  : "border-[#333] hover:border-blue-500 hover:bg-[#101020]"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <Upload className="h-12 w-12 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-white">
                    {isDragActive
                      ? "Drop the file here"
                      : "Drag and drop your document here, or click to select"}
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports PDF, DOC, DOCX, and TXT files
                  </p>
                </div>
              </div>
            </div>

            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-[#151515] border border-[#222] rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <File className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-white">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-[#1a1a1a]" onClick={() => setFile(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setFile(null)} 
              disabled={!file || isUploading || isProcessing}
              className="border-[#333] text-white hover:bg-[#1a1a1a]"
            >
              Clear
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upload & Process"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border-[#222] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Extracted Questions</DialogTitle>
              <DialogDescription className="text-gray-400">
                We found the following questions and answers in your document.
                Select the ones you want to add to your knowledge base.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
              {extractedQuestions.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 border rounded-lg transition-colors ${
                    item.selected 
                      ? "border-blue-500 bg-[#101020]" 
                      : "border-[#222]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`mt-1 h-6 w-6 rounded-full ${
                        item.selected 
                          ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white border-blue-500" 
                          : "border-[#333] text-white"
                      }`}
                      onClick={() => toggleQuestionSelection(item.id)}
                    >
                      {item.selected ? <Check className="h-3 w-3" /> : null}
                    </Button>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.question}</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowQuestionsDialog(false)}
                className="border-[#333] text-white hover:bg-[#1a1a1a]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddToKnowledgeBase}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add to Knowledge Base
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
