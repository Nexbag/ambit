import Image from "next/image";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--bg)",
      }}
    >
      <Image src={"/assets/loading.webp"} alt="" height={150} width={150} />
    </div>
  );
}
