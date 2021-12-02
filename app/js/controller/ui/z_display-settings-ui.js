/**
 * @author indivisualvj / https://github.com/indivisualvj
 */
{

    HC.DisplaySettingsUi = class DisplaySettingsUi extends HC.PropertyUi {

        addControllers(groups, controlSets, uiClass, parent) {
            parent = parent || this;
            for (let k in groups) {
                let group = groups[k];
                let folder = parent.addFolder(k);
                let sets = {};

                for (let s in group) {
                    sets[s] = controlSets[k + '.' + s];
                }

                this._addControllers(sets, uiClass, folder);
            }
        }
    }
}
