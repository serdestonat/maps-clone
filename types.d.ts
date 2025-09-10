import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    function graphHopper(
      apiKey: string,
      options?: {
        urlParameters?: {
          vehicle?: string;
        };
      }
    ): L.Routing.IRouter;
  }
}
