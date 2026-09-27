/// <reference path="../pb_data/types.d.ts" />

// Personal-use app: every API rule is "" (public), so the frontend needs no auth.
migrate((app) => {
  const collection = new Collection({
    type: "base",
    name: "players",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    fields: [
      { name: "name", type: "text", required: true },
      { name: "characterClass", type: "text" },
      { name: "armorClass", type: "number", onlyInt: true },
      { name: "maxHp", type: "number", onlyInt: true },
      { name: "passivePerception", type: "number", onlyInt: true },
      { name: "passiveInsight", type: "number", onlyInt: true },
      { name: "passiveInvestigation", type: "number", onlyInt: true },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  })

  app.save(collection)
}, (app) => {
  app.delete(app.findCollectionByNameOrId("players"))
})
