import Dropzone from "react-dropzone";

type DropZoneInputProps = {
  onFileDrop: (file: File) => void;
  uploading?: boolean;
};

export default function DropZoneInput({
  onFileDrop,
  uploading,
}: DropZoneInputProps) {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        if (acceptedFiles[0]) onFileDrop(acceptedFiles[0]);
      }}
      accept={{
        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      }}
      disabled={uploading}
    >
      {({ getRootProps, getInputProps, isDragActive, isDragAccept }) => (
        <section
          className={`px-2 py-4 border-2 hover:cursor-pointer ${isDragActive ? (isDragAccept ? "bg-green-300 border-green-600" : "bg-red-300 border-red-600") : "border-dashed border-gray-500/50"}`}
        >
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              isDragAccept ? (
                <p>Drop file</p>
              ) : (
                <p>Not valid file type</p>
              )
            ) : (
              <p>Drag and drop files here or click to select</p>
            )}
          </div>
        </section>
      )}
    </Dropzone>
  );
}
