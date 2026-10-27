import { VisualSyringe } from "./VisualSyringe";
import type { SyringeState } from "./syringeState";

/**
 * The syringe drawing plus the app's caption line, on a bone card so the
 * off-white barrel reads against the page.
 */
export function SyringePanel({
  drawUnitsU100,
  drawUnitsExact,
  syringeMax,
  state,
}: {
  drawUnitsU100: number;
  drawUnitsExact?: number;
  syringeMax: number;
  state: SyringeState;
}) {
  return (
    <figure className="rounded-3xl border border-espresso/[0.10] bg-bone px-4 pb-4 pt-3">
      <div className="mx-auto max-w-[400px]">
        <VisualSyringe
          drawUnitsU100={drawUnitsU100}
          drawUnitsExact={drawUnitsExact}
          maxUnits={syringeMax}
          state={state}
        />
      </div>
      <figcaption className="mt-1 text-center text-[12.5px] text-graphite">
        {`${syringeMax} IU U-100 syringe · drawing ${drawUnitsU100} of ${syringeMax} units`}
      </figcaption>
    </figure>
  );
}
