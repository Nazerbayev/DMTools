/// <reference path="../pb_data/types.d.ts" />

// Personal-use app: every API rule is "" (public), so the frontend needs no auth.
migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "enemies",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      { name: "name", type: "text", required: true },
      {
        name: "size",
        type: "select",
        maxSelect: 1,
        values: ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"],
      },
      { name: "type", type: "text" },
      { name: "alignment", type: "text" },
      { name: "armorClass", type: "number", onlyInt: true },
      { name: "hitPoints", type: "number", onlyInt: true },
      { name: "speed", type: "text" },
      { name: "challengeRating", type: "text" },
      { name: "abilityScores", type: "json" },
      { name: "traits", type: "text" },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  })

  app.save(collection)
}, (app) => {
  app.delete(app.findCollectionByNameOrId("enemies"))
})
