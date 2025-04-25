declare module "find-free-port" {
  function findFreePort(
    startPort: number,
    endPort: number,
    callback: (err: Error | null, port: number) => void
  ): void;

  function findFreePort(
    startPort: number,
    callback: (err: Error | null, port: number) => void
  ): void;

  export default findFreePort;
}
