export async function getConfederatesStart() {
  const [femaleResp, maleResp] = await Promise.all([
    fetch("/confederates/confederates_f.json"),
    fetch("/confederates/confederates_m.json")
  ]);

  if (!femaleResp.ok || !maleResp.ok) {
    throw new Error("Failed to fetch confederates data.");
  }

  const [femaleData, maleData] = await Promise.all([femaleResp.json(), maleResp.json()]);
  return { femaleData, maleData };
}
