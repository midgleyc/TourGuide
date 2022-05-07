//Unbreakable Umbrella
RegisterResourceGenerationFunction("IOTMUnbreakableUmbrellaGenerateResource");
void IOTMUnbreakableUmbrellaGenerateResource(ChecklistEntry [int] resource_entries)
{
    item unbrella = lookupItem("unbreakable umbrella");
    if (!unbrella.have()) return;
    if (!__misc_state["in run"]) return; 
    string url;
	string unbrellaMode = get_property("umbrellaState");
	string unbrellaEnchant;
	string [int] description;
    url = invSearch("unbreakable umbrella");
    // Title
        string main_title = "Umbrella machine " + HTMLGenerateSpanFont("B", "red") + "roke";
        description.listAppend("Understanda" + HTMLGenerateSpanFont("B", "red") + "le have a nice day.");
		
		if (unbrellaMode == "broken") {
			int modifiedML = ceil(numeric_modifier("monster level") * 1.25);
			unbrellaEnchant = "+25% ML. Unbrella-boosted ML will be " + modifiedML + ".";
		}
		else if (unbrellaMode == "forward") {
			unbrellaEnchant = "+25 DR shield";
		}
		else if (unbrellaMode == "bucket") {
			unbrellaEnchant = "+25% item drops";
		}
		else if (unbrellaMode == "pitchfork") {
			unbrellaEnchant = "+25 Weapon Damage";
		}
		else if (unbrellaMode == "twirling") {
			unbrellaEnchant = "+25 Spell Damage";
		}
		else if (unbrellaMode == "cocoon") {
			unbrellaEnchant = "-10% Combat Frequency";
		}
		description.listAppend(HTMLGenerateSpanOfClass("Current enchantment: ", "r_bold") + unbrellaMode);
		description.listAppend(HTMLGenerateSpanFont(unbrellaEnchant, "blue") + "");
		resource_entries.listAppend(ChecklistEntryMake("__item unbreakable umbrella", "inventory.php?action=useumbrella&pwd=" + my_hash(), ChecklistSubentryMake(main_title, "", description)));
}