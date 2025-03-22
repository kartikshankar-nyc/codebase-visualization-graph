
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UploadDialogProps {
  onFileSelected: (file: File) => void;
  trigger?: React.ReactNode;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ onFileSelected, trigger }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Browse Files</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Project Files</DialogTitle>
          <DialogDescription>
            Choose a ZIP file containing your project's source code to visualize its structure.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-upload" className="text-right">
              File
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".zip"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
                onFileSelected(fileInputRef.current.files[0]);
              }
            }}
          >
            Visualize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
