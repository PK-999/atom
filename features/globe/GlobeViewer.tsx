import React from "react";
import type { Facility } from "../../lib/globe/schemas";

export function GlobeViewer({
  facilities,
}: {
  facilities: readonly Facility[];
}) {
  return (
    <section aria-labelledby="globe-viewer-title">
      <h2 id="globe-viewer-title">Nuclear Globe</h2>
      <div className="map-placeholder" aria-hidden="true">
        {/* MapLibre GL JS instance will render here */}
        <p>Interactive Map View</p>
      </div>

      <div className="accessible-fallback">
        <h3>Facility List</h3>
        <table aria-label="Nuclear Facilities List">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Country</th>
              <th scope="col">Status</th>
              <th scope="col">Capacity (MW)</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((facility) => (
              <tr key={facility.id}>
                <th scope="row">{facility.name}</th>
                <td>{facility.countryCode}</td>
                <td>{facility.status}</td>
                <td>{facility.totalCapacityMw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
