"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var url_1 = require("url");
var PORT = 3000;
var deck = [];
function initializeDeck() {
    var suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    var values = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
    ];
    var id = 1;
    deck = [];
    suits.forEach(function (suit) {
        values.forEach(function (value) {
            deck.push({ id: id++, suit: suit, value: value });
        });
    });
}
initializeDeck();
function shuffleDeck() {
    var _a;
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [deck[j], deck[i]], deck[i] = _a[0], deck[j] = _a[1];
    }
}
var server = (0, http_1.createServer)(function (req, res) {
    var _a, _b;
    var url = (0, url_1.parse)(req.url || "", true);
    var method = req.method;
    res.setHeader("Content-Type", "application/json");
    if (url.pathname === "/api/cards" && method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify(deck));
    }
    else if (url.pathname === "/api/cards/random" && method === "GET") {
        var randomCard = deck[Math.floor(Math.random() * deck.length)];
        res.statusCode = 200;
        res.end(JSON.stringify(randomCard));
    }
    else if (url.pathname === "/api/cards" && method === "POST") {
        var body_1 = "";
        req.on("data", function (chunk) {
            body_1 += chunk.toString();
        });
        req.on("end", function () {
            var newCard = JSON.parse(body_1);
            newCard.id = deck.length ? deck[deck.length - 1].id + 1 : 1;
            deck.push(newCard);
            res.statusCode = 201;
            res.end(JSON.stringify(newCard));
        });
    }
    else if (url.pathname === "/api/cards/shuffle" && method === "POST") {
        // Shuffle the deck
        shuffleDeck();
        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Deck shuffled successfully" }));
    }
    else if (((_a = url.pathname) === null || _a === void 0 ? void 0 : _a.startsWith("/api/cards/")) && method === "DELETE") {
        // Delete a card by ID
        var id_1 = parseInt(url.pathname.split("/")[3]);
        var cardIndex = deck.findIndex(function (card) { return card.id === id_1; });
        if (cardIndex > -1) {
            var deletedCard = deck.splice(cardIndex, 1);
            res.statusCode = 200;
            res.end(JSON.stringify(deletedCard));
        }
        else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Card not found" }));
        }
    }
    else if (((_b = url.pathname) === null || _b === void 0 ? void 0 : _b.startsWith("/api/cards/")) &&
        method === "POST" &&
        url.pathname.endsWith("/duplicate")) {
        // Duplicate a card by ID
        var id_2 = parseInt(url.pathname.split("/")[3]);
        var card = deck.find(function (c) { return c.id === id_2; });
        if (card) {
            var duplicatedCard = __assign(__assign({}, card), { id: deck[deck.length - 1].id + 1 });
            deck.push(duplicatedCard);
            res.statusCode = 201;
            res.end(JSON.stringify(duplicatedCard));
        }
        else {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: "Card not found" }));
        }
    }
    else {
        // Route not found
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});
// Start the server
server.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
