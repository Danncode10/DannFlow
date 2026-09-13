export type ArtifactKind = "text" | "code" | "image" | "sheet";

export type UIArtifact = {
  documentId: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  isVisible: boolean;
  status: "streaming" | "idle";
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
};
