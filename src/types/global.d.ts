interface Window {
  vapiInstance: any;
  vapiSDK: {
    run: (config: {
      apiKey: string;
      assistant: string;
      config: Record<string, any>;
    }) => any;
  };
}