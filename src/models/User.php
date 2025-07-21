<?php

namespace Vendor\Name\models;

class User
{
    public string $id;
    public string $username;


    public function __construct(array $data)
    {
        $this->id = $data['id'] ?? uniqid();
        $this->username = $data['username'] ?? '';
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
        ];
    }
}
