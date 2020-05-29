var AndroidParseApp = function() {
    this.m_Config;
    this.m_CurrentCard;

    this.Init = function(a_config) {
        this.m_Config = a_config;
        this.LoadCard(0);
    }

    this.LoadCard = function(index) {
        // Load in card
        var CurrStoryText   = this.m_Config.CardTree[index].StoryText;
        var regex           = /\n/gi;

        CurrStoryText       = CurrStoryText.replace(regex, "<br/>");
        
        $(".game-story-text-wrapper").html(CurrStoryText);
        $(".game-choice-button-wrapper").html("");
        for(button = 0; button < this.m_Config.CardTree[index].Choices.length; button++) {
            var ButtonText  = this.m_Config.CardTree[index].Choices[button].ChoiceText;
            var GoToIndex   = this.m_Config.CardTree[index].Choices[button].GoToIndex;
            $(".game-choice-button-wrapper").append("<button onclick='GameApp.LoadCard(" + GoToIndex + ");'>" + ButtonText + "</button>");
        }

        // Enforce config
        $(".game-wrapper").css("font-size", this.m_Config.FontSize);
        $(".game-choice-button-wrapper button").css("font-size", this.m_Config.FontSize);

        // Enforce styling
        $(".game-story-text-wrapper").css("padding-bottom", $(".game-choice-button-wrapper").height() + 50);
    }
}

var GameApp = new AndroidParseApp();
GameApp.Init(JSON.parse(data));





