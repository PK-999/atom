import React from "react";
import type { NationalProfile } from "../../lib/national/schemas";

export function NationalProfile({ profile }: { profile: NationalProfile }) {
  return (
    <article aria-labelledby={`profile-title-${profile.id}`}>
      <h2 id={`profile-title-${profile.id}`}>
        {profile.countryName} Energy Profile
      </h2>

      <section>
        <h3>Domestic Policy & Context</h3>
        <p>{profile.domesticPolicy}</p>
      </section>

      <section>
        <h3>Reactor Fleet</h3>
        <p>{profile.reactorFleetSummary}</p>
      </section>

      <section>
        <h3>Electricity Mix</h3>
        <ul>
          {profile.energyMix.map((mix) => (
            <li key={mix.source}>
              {mix.source}: {mix.percentage}%
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
