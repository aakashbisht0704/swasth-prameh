"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';

export function ReportUploadStep({ onNext, onBack, initialData }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(initialData?.report_url || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const filePath = `reports/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('reports').upload(filePath, file);
    if (!error) {
      const { data } = supabase.storage.from('reports').getPublicUrl(filePath);
      setUploadedUrl(data.publicUrl);
      alert('Report uploaded!');
    } else {
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (uploadedUrl) {
      onNext({ report_url: uploadedUrl });
    } else {
      alert('Please upload your report first.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report">Upload your recent lab reports (PDF, JPG, PNG)</Label>
            <input
              id="report"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full text-white"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #666',
                borderRadius: '4px',
                padding: '8px',
                color: '#fff'
              }}
            />
            <Button type="button" onClick={handleUpload} disabled={!file || uploading} className="mt-2">
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            {uploadedUrl && (
              <div className="mt-2 text-green-500">Uploaded! <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline">View Report</a></div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
