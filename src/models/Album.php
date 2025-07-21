<?php

namespace Vendor\Name\models;

class Album{
    public string $userId;
    public string $id;
    public string $title;

    public function __construct(array $data)
    {
        $this->userId = $data['userId'];
        $this->id = $data['id'] ?? uniqid();
        $this->title = $data['title'] ?? '';
    }

    public function toArray(){
        return [
            'userId' => $this->userId,
            'id' => $this->id,
            'title' => $this->title
        ];
    }
}